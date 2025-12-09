import {
  Component,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ToastMessageService } from '../../../../../shared/services/toast-message.service';
import { TeamService } from '../../services/team.service';
import { UserService } from '../../../../../core/services/user.service';
import { OperationService } from '../../../operation/services/operation.service';
import { Modal } from 'bootstrap';
import { EntitySimple } from '../../interfaces/entity-simple.interface';
import { EnumsList } from '../../../../../shared/utils/enums-list.class';
import { OptionsPaginatedOperation } from '../../../../../shared/interfaces/options-paginated.interface';
import { Position } from '../../../../../core/enums/position-user.enum';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { InfoSimpleMapper } from '../../mapping/info-simple.mapper';
import { TeamRequest2 } from '../../interfaces/team.interface';
import { MemberRequest } from '../../../../chat/interfaces/room.interface';
import { Permission } from '../../../../../core/enums/permission.enum';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RemoveUnderScorePipe } from '../../../../../shared/pipes/remove-underscore.pipe';

export interface OptionsPaginatedUserTeam {
  page?: number;
  size?: number;
  state?: boolean;
  filter?: string;
  cargo?: Position;
  idTeam?: number;
}

@Component({
  selector: 'team-edit',
  imports: [RemoveUnderScorePipe, ReactiveFormsModule, FormsModule],
  templateUrl: './team-edit.component.html',
})
export class TeamEditComponent {
  private toastService = inject(ToastMessageService);
  private teamService = inject(TeamService);

  private userService = inject(UserService);
  private operationService = inject(OperationService);

  optionsFilterOperations = signal<OptionsPaginatedOperation>({
    page: 1,
    estado: true,
    size: 15,
  });
  optionsFilterSupervisors = signal<OptionsPaginatedUserTeam>({
    page: 1,
    state: true,
    size: 15,
    cargo: Position.SUPERVISOR,
  });
  optionsFilterMembers = signal<OptionsPaginatedUserTeam>({
    page: 1,
    state: true,
    size: 15,
    cargo: Position.COLABORADOR,
  });

  /* Signals */
  idTeam = input.required<number | null>();
  dataTeamUpdated = signal<TeamRequest2>({});
  updateTable = output<boolean>();

  loadTeamEffect = effect(() => {
    if (!this.idTeam()) return;

    this.optionsFilterSupervisors.update((v) => ({
      ...v,
      idTeam: this.idTeam()!,
    }));
    this.optionsFilterMembers.update((v) => ({ ...v, idTeam: this.idTeam()! }));

    this.teamService.getTeamById(this.idTeam()!).subscribe((data) => {
      if (!data) return;

      const idSupervisor = data.datosSupervisor.id;
      const idJefeOperacion = data.datosOperacion.datosJefeOperacion.id;

      const members: MemberRequest[] = data.datosGrupo.sala.integrantes
        .filter(
          (val) =>
            val.usuarioResponse.id !== idJefeOperacion &&
            val.usuarioResponse.id !== idSupervisor
        )
        .map((val) => ({
          idUsuario: val.usuarioResponse.id,
          tipoPermiso: val.permiso,
        }));

      const dataMapped: TeamRequest2 = {
        nombre: data.datosGrupo.nombre,
        descripcion: data.datosGrupo.descripcion,
        idOperacion: data.datosOperacion.idOperacion,
        idSupervisor: idSupervisor,
        integrantes: members,
      };

      this.dataTeamUpdated.set(dataMapped);
    });
  });

  /* Referencia al modal actual */
  modalElement = viewChild<ElementRef<HTMLDivElement>>('modalElement');
  modalInstance = signal<Modal | null>(null);

  /* Asignacion como Elemento Modal */
  ngAfterViewInit() {
    this.modalInstance.set(new Modal(this.modalElement()!.nativeElement));
  }

  /* Mostrar modal */
  show() {
    this.modalInstance()!.show();
  }

  /* Ocultar modal */
  close() {
    this.modalInstance()!.hide();
  }

  operations = signal<EntitySimple[]>([]);
  supervisors = signal<EntitySimple[]>([]);
  members = signal<EntitySimple[]>([]);
  permissions = EnumsList.permissions;

  pageMaxOperations = signal<number>(0);
  pageMaxSupervisors = signal<number>(0);
  pageMaxMembers = signal<number>(0);

  operationsResource = rxResource({
    request: () => ({
      options: this.optionsFilterOperations(),
    }),
    loader: ({ request }) => {
      return this.operationService
        .getOperationPaginated(request.options)
        .pipe(map((resp) => resp.data));
    },
  });

  supervisorsResource = rxResource({
    request: () => ({
      options: this.optionsFilterSupervisors(),
    }),
    loader: ({ request }) => {
      return this.userService.getUsersWithTeamAndWithoutCampaignPaginated(
        request.options
      );
    },
  });

  membersResource = rxResource({
    request: () => ({
      options: this.optionsFilterMembers(),
    }),
    loader: ({ request }) => {
      return this.userService.getUsersWithTeamAndWithoutCampaignPaginated(
        request.options
      );
    },
  });

  operationEffect = effect(() => {
    const data = this.operationsResource.value();
    const options = this.optionsFilterOperations();

    if (data) {
      this.pageMaxOperations.set(data.totalPages);

      // Transformamos operaciones
      let resultTransform = data.result.map((val) =>
        InfoSimpleMapper.transformOperation(val)
      );

      // Marcamos cuál es la operación seleccionada actualmente
      resultTransform = resultTransform.map((v) => ({
        ...v,
        isSelected: v.id === this.dataTeamUpdated().idOperacion,
      }));

      // Actualizamos el estado global
      this.operations.update((previous) => {
        // Primer page o cuando no hay data previa
        if (options.page === 1 || previous.length === 0) {
          return resultTransform;
        }

        // Evitar duplicados en concatenación
        const idsPrev = new Set(previous.map((x) => x.id));

        return [
          ...previous,
          ...resultTransform.filter((x) => !idsPrev.has(x.id)),
        ];
      });
    }
  });

  supervisorEffect = effect(() => {
    const data = this.supervisorsResource.value();
    const options = this.optionsFilterSupervisors();

    if (data) {
      this.pageMaxSupervisors.set(data.totalPages);

      // Transformar la data
      let resultTransform = data.result.map((val) =>
        InfoSimpleMapper.transformUser(val)
      );

      // Marcar supervisor seleccionado si ya existía en dataNewTeam
      resultTransform = resultTransform.map((v) => ({
        ...v,
        isSelected: v.id === this.dataTeamUpdated().idSupervisor,
      }));

      // Actualizar listado completo
      this.supervisors.update((previous) => {
        if (options.page === 1 || previous.length === 0) {
          return resultTransform;
        }

        // Si es paginación, concatenamos pero SIN duplicar
        const idsPrev = new Set(previous.map((x) => x.id));

        const merged = [
          ...previous,
          ...resultTransform.filter((x) => !idsPrev.has(x.id)),
        ];

        return merged;
      });
    }
  });

  memberEffect = effect(() => {
    const data = this.membersResource.value();
    const options = this.optionsFilterMembers();

    if (!data) return;

    this.pageMaxMembers.set(data.totalPages);

    // Convertir SOLO la nueva página
    let resultTransform = data.result.map((val) =>
      InfoSimpleMapper.transformUser(val)
    );

    const prevIntegrantes = this.dataTeamUpdated().integrantes ?? [];

    // Marcar seleccionados SOLO en esta página
    resultTransform = resultTransform.map((v) => {
      const idx = prevIntegrantes.findIndex((c) => c.idUsuario === v.id);

      if (idx >= 0) {
        v.isSelected = true;
        v.permission = prevIntegrantes[idx].tipoPermiso;
      }

      return v;
    });

    // Reemplazar si es page 1, sino APPEND sin repetir
    this.members.update((previous) => {
      if (options.page === 1) return resultTransform;

      // evitar duplicados por id
      const idsPrev = new Set(previous.map((x) => x.id));

      const newItems = resultTransform.filter((x) => !idsPrev.has(x.id));

      return [...previous, ...newItems];
    });
  });

  selectOperation(op: EntitySimple, isSelected: boolean) {
    this.operations.update((list) =>
      list.map((x) => ({
        ...x,
        isSelected: x.id === op.id ? isSelected : false,
      }))
    );

    this.dataTeamUpdated.update((v) => ({
      ...v,
      idOperacion: isSelected ? op.id : undefined,
    }));
  }

  selectSupervisor(sup: EntitySimple, isSelected: boolean) {
    this.supervisors.update((list) =>
      list.map((x) => ({
        ...x,
        isSelected: x.id === sup.id ? isSelected : false,
      }))
    );

    this.dataTeamUpdated.update((v) => ({
      ...v,
      idSupervisor: isSelected ? sup.id : undefined,
    }));
  }

  selectMember(mem: EntitySimple) {
    mem.isSelected = !mem.isSelected;

    this.dataTeamUpdated.update((team) => {
      const prev = team.integrantes ?? [];

      if (mem.isSelected) {
        // AGREGAR
        const nuevo: MemberRequest = {
          idUsuario: mem.id,
          tipoPermiso: mem.permission!,
        };

        return {
          ...team,
          integrantes: [...prev, nuevo],
        };
      } else {
        // QUITAR
        return {
          ...team,
          integrantes: prev.filter((i) => i.idUsuario !== mem.id),
        };
      }
    });
  }

  filterOperation(txt: string) {
    this.optionsFilterOperations.set({
      page: 1,
      estado: true,
      size: 15,
      filtro: txt,
    });
  }

  filterSupervisor(txt: string) {
    this.optionsFilterSupervisors.set({
      filter: txt,
      state: true,
      page: 1,
      size: 15,
      cargo: Position.SUPERVISOR,
      idTeam: this.idTeam()!,
    });
  }

  filterMembers(txt: string) {
    this.optionsFilterMembers.set({
      filter: txt,
      state: true,
      page: 1,
      size: 15,
      cargo: Position.COLABORADOR,
      idTeam: this.idTeam()!,
    });
  }

  private threshold = 50;

  onScrollOperations(ev: Event) {
    const div = ev.target as HTMLElement;

    const distanceToBottom =
      div.scrollHeight - (div.scrollTop + div.clientHeight);

    if (distanceToBottom <= this.threshold) {
      const currentPage = this.optionsFilterOperations().page;

      if (currentPage! < this.pageMaxOperations()) {
        this.optionsFilterOperations.update((prev) => ({
          ...prev,
          page: prev.page! + 1,
        }));
      }
    }
  }

  onScrollSupervisors(ev: Event) {
    const div = ev.target as HTMLElement;

    const distanceToBottom =
      div.scrollHeight - (div.scrollTop + div.clientHeight);

    if (distanceToBottom <= this.threshold) {
      const currentPage = this.optionsFilterSupervisors().page;

      if (currentPage! < this.pageMaxSupervisors()) {
        this.optionsFilterSupervisors.update((prev) => ({
          ...prev,
          page: prev.page! + 1,
        }));
      }
    }
  }

  onScrollMembers(ev: Event) {
    const div = ev.target as HTMLElement;

    const distanceToBottom =
      div.scrollHeight - (div.scrollTop + div.clientHeight);

    if (distanceToBottom <= this.threshold) {
      const currentPage = this.optionsFilterMembers().page;

      if (currentPage! < this.pageMaxMembers()) {
        this.optionsFilterMembers.update((prev) => ({
          ...prev,
          page: prev.page! + 1,
        }));
      }
    }
  }

  changePermissionMember(mem: EntitySimple, value: string) {
    const permission = value as Permission;

    // Actualizamos la lista general de miembros
    this.members.update((list) =>
      list.map((m) => (m.id === mem.id ? { ...m, permission } : m))
    );

    // Si el miembro está seleccionado, lo actualizamos en el modelo del equipo
    this.dataTeamUpdated.update((team) => {
      if (!mem.isSelected) return team;

      const updatedMember: MemberRequest = {
        idUsuario: mem.id,
        tipoPermiso: permission,
      };

      const updatedList = (team.integrantes ?? []).map((i) =>
        i.idUsuario === mem.id ? updatedMember : i
      );

      return {
        ...team,
        integrantes: updatedList,
      };
    });
  }

  updateNombre(txt: string) {
    this.dataTeamUpdated.update((v) => ({ ...v, nombre: txt }));
  }

  updateDescripcion(txt: string) {
    this.dataTeamUpdated.update((v) => ({ ...v, descripcion: txt }));
  }

  updateTeam() {
    if (!this.dataTeamUpdated().nombre) {
      this.toastService.show(
        'El equipo debe tener un nombre de grupo asignado.',
        'text-bg-danger'
      );
      return;
    }
    if (!this.dataTeamUpdated().descripcion) {
      this.toastService.show(
        'El equipo debe tener una descripcion asignada.',
        'text-bg-danger'
      );
      return;
    }
    if (!this.dataTeamUpdated().idOperacion) {
      this.toastService.show(
        'Debe seleccionar una operación.',
        'text-bg-danger'
      );
      return;
    }
    if (!this.dataTeamUpdated().idSupervisor) {
      this.toastService.show(
        'Debe seleccionar un supervisor.',
        'text-bg-danger'
      );
      return;
    }
    if (
      !this.dataTeamUpdated().integrantes ||
      this.dataTeamUpdated().integrantes?.length == 0
    ) {
      this.toastService.show(
        'Debe seleccionar integrantes para el equipo.',
        'text-bg-danger'
      );
      return;
    }

    this.teamService
      .updateTeam(this.idTeam()!, this.dataTeamUpdated())
      .subscribe((resp) => {
        if (resp) {
          this.toastService.show(
            'Equipo actualizado satisfactoriamente.',
            'text-bg-success'
          );
          this.updateTable.emit(true);
          this.close();
        }
      });
  }
}
